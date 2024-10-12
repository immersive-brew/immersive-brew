'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Importing the Supabase client

type StepType = 'bloom' | 'pour' | 'wait';
type BrewMethodType = 'V60' | 'Chemex' | 'AeroPress' | 'French Press'; // Brew method types

interface Step {
  id: number;
  step_type: StepType;
  description: string;
  numerator: string; // Dropdown for numerator
  denominator: string; // Dropdown for denominator
  duration: number; // Duration in seconds
}

interface RecipeFormProps {
  onSubmit?: () => void; // Callback after successful submission
  onCancel?: () => void; // Callback to cancel
}

const supabase = createClient(); // Initialize Supabase client

export default function RecipeForm({ onSubmit, onCancel }: RecipeFormProps) {
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [brewMethod, setBrewMethod] = useState<BrewMethodType>('V60'); // State for brew method
  const [steps, setSteps] = useState<Step[]>([
    {
      id: Date.now(),
      step_type: 'bloom',
      description: '',
      numerator: '1',
      denominator: '2',
      duration: 0, // Initialize with 0 seconds
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [totalWeight, setTotalWeight] = useState(0);

  // Utility function to convert fraction to decimal
  const convertFractionToDecimal = (numerator: string, denominator: string) => {
    const num = Number(numerator);
    const den = Number(denominator);
    return den !== 0 ? num / den : 0;
  };

  // Handle changes in the steps
  const handleStepChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedSteps = [...steps];
    updatedSteps[index] = {
      ...updatedSteps[index],
      [name]: value,
    };
    setSteps(updatedSteps);
  };

  // Increment duration by 5 seconds
  const incrementDuration = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].duration += 5;
    setSteps(updatedSteps);
  };

  // Decrement duration by 5 seconds (minimum 0)
  const decrementDuration = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps[index].duration = Math.max(updatedSteps[index].duration - 5, 0);
    setSteps(updatedSteps);
  };

  // Add a new step
  const addStep = () => {
    setSteps([
      ...steps,
      {
        id: Date.now(),
        step_type: 'pour', // Default type for new steps
        description: '',
        numerator: '1',
        denominator: '2',
        duration: 0,
      },
    ]);
  };

  // Remove step
  const removeStep = (index: number) => {
    const updatedSteps = [...steps];
    updatedSteps.splice(index, 1);
    setSteps(updatedSteps);
  };

  // Calculate total weight whenever steps change
  useEffect(() => {
    const total = steps.reduce((acc, step) => {
      if (step.step_type === 'bloom' || step.step_type === 'pour') {
        return acc + convertFractionToDecimal(step.numerator, step.denominator);
      }
      return acc;
    }, 0);
    setTotalWeight(total);
  }, [steps]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate recipe name and description
    if (!recipeName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a recipe name.' });
      setLoading(false);
      return;
    }

    if (!recipeDescription.trim()) {
      setMessage({ type: 'error', text: 'Please enter a recipe description.' });
      setLoading(false);
      return;
    }

    // Validate steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.description.trim()) {
        setMessage({ type: 'error', text: `Please enter a description for Step ${i + 1}.` });
        setLoading(false);
        return;
      }
      if (
        (step.step_type === 'bloom' || step.step_type === 'pour') &&
        (!step.numerator || !step.denominator)
      ) {
        setMessage({
          type: 'error',
          text: `Please select numerator and denominator for Step ${i + 1}.`,
        });
        setLoading(false);
        return;
      }
      if (step.duration < 0) {
        setMessage({
          type: 'error',
          text: `Duration for Step ${i + 1} cannot be negative.`,
        });
        setLoading(false);
        return;
      }
    }

    // Check total weight equals 1
    if (Math.abs(totalWeight - 1) > 0.0001) {
      setMessage({
        type: 'error',
        text: `Total weight must equal 1. Currently, it is ${totalWeight.toFixed(2)}.`,
      });
      setLoading(false);
      return;
    }

    // Prepare steps for submission
    const preparedSteps = steps.map((step) => ({
      step_type: step.step_type,
      description: step.description,
      weight: step.step_type !== 'wait' ? convertFractionToDecimal(step.numerator, step.denominator) : null,
      duration: step.duration,
    }));

    const data = {
      name: recipeName,
      description: recipeDescription,
      brew_method: brewMethod, // Include selected brew method
      steps: preparedSteps,
    };

    try {
      // Insert into Supabase
      const { data: recipe, error: recipeError } = await supabase
        .from('recipes')
        .insert([data])
        .select()
        .single();

      if (recipeError) {
        throw recipeError;
      }

      setMessage({ type: 'success', text: 'Recipe submitted successfully.' });
      if (onSubmit) {
        onSubmit();
      }

      // Optionally reset the form
      setRecipeName('');
      setRecipeDescription('');
      setBrewMethod('V60'); // Reset brew method to default
      setSteps([
        {
          id: Date.now(),
          step_type: 'bloom',
          description: '',
          numerator: '1',
          denominator: '2',
          duration: 0,
        },
      ]);
    } catch (error: any) {
      console.error('Error:', error.message);
      setMessage({
        type: 'error',
        text: error.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Recipe Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Name</label>
        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter recipe name"
          required
        />
      </div>

      {/* Recipe Description */}
      <div>
        <label className="block text-sm font-medium mb-1">Recipe Description</label>
        <textarea
          value={recipeDescription}
          onChange={(e) => setRecipeDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter recipe description"
          required
        />
      </div>

      {/* Brew Method Dropdown */}
      <div>
        <label className="block text-sm font-medium mb-1">Brew Method</label>
        <select
          value={brewMethod}
          onChange={(e) => setBrewMethod(e.target.value as BrewMethodType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="V60">V60</option>
          <option value="Chemex">Chemex</option>
          <option value="AeroPress">AeroPress</option>
          <option value="French Press">French Press</option>
        </select>
      </div>

      {/* Total Weight Indicator */}
      <div className="text-right">
        <p
          className={`text-sm ${
            Math.abs(totalWeight - 1) > 0.0001 ? 'text-red-600' : 'text-green-600'
          }`}
        >
          Total Weight: {totalWeight.toFixed(2)}{' '}
          {Math.abs(totalWeight - 1) > 0.0001 && '(Must equal 1)'}
        </p>
      </div>

      {/* Steps */}
      {steps.map((step, index) => (
        <div
          key={step.id}
          className={`relative border rounded-lg shadow-md p-6 bg-white ${
            step.step_type === 'bloom'
              ? 'border-blue-300'
              : step.step_type === 'pour'
              ? 'border-blue-700'
              : 'border-gray-300'
          }`}
        >
          {/* Stripe Indicator */}
          <div
            className={`absolute top-0 left-0 h-full w-2 ${
              step.step_type === 'bloom'
                ? 'bg-blue-300'
                : step.step_type === 'pour'
                ? 'bg-blue-700'
                : 'bg-gray-300'
            } rounded-l-lg`}
          ></div>

          <div className="ml-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Step {index + 1}</h3>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Step Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Step Type</label>
              <select
                name="step_type"
                value={step.step_type}
                onChange={(e) => handleStepChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bloom">Bloom</option>
                <option value="pour">Pour</option>
                <option value="wait">Wait</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                name="description"
                value={step.description}
                onChange={(e) => handleStepChange(index, e)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
                required
              />
            </div>

            {/* Weight (only for 'bloom' and 'pour') */}
            {(step.step_type === 'bloom' || step.step_type === 'pour') && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Weight</label>
                <div className="flex items-center space-x-2">
                  {/* Numerator */}
                  <select
                    name="numerator"
                    value={step.numerator}
                    onChange={(e) => handleStepChange(index, e)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`num-${i + 1}`} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <span className="text-gray-700">/</span>
                  {/* Denominator */}
                  <select
                    name="denominator"
                    value={step.denominator}
                    onChange={(e) => handleStepChange(index, e)}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`den-${i + 1}`} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Selected Weight: {convertFractionToDecimal(step.numerator, step.denominator).toFixed(2)}
                </p>
              </div>
            )}

            {/* Duration in Seconds */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Duration (Seconds)</label>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => decrementDuration(index)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  -
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-md w-16 text-center">
                  {step.duration}
                </span>
                <button
                  type="button"
                  onClick={() => incrementDuration(index)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Add Step Button */}
      <div>
        <button
          type="button"
          onClick={addStep}
          className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          + Add Step
        </button>
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className={`flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            loading || Math.abs(totalWeight - 1) > 0.0001 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading || Math.abs(totalWeight - 1) > 0.0001}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Feedback Message */}
      {message && (
        <p
          className={`mt-4 text-center text-sm ${
            message.type === 'success' ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
