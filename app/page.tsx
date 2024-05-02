'use client'

import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js'
const supabase = createClient("https://qdtinodmdbrxykyhampv.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkdGlub2RtZGJyeHlreWhhbXB2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ2Nzk4NjYsImV4cCI6MjAzMDI1NTg2Nn0.Yaf1OZvaD-4FtJ6fNNySrvChKVie11BqvV8AIt7PX14")

function Test() {
  const [text, setText] = useState<string | null>(null) as any

  useEffect(() => {
    const getData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('budget_categories')
          .select()
      }
    }
    getData()

  }, [])

  async function handleSend() {
    console.log("submitting ", text)

    const { data, error } = await supabase
      .from('demo_access')
      .insert([{ text }])
      .select()

    if (data && !error) {
      alert(
        'Data added successfully.'
      )
      setText(null)
      window.location.reload()
    }
  }

  return (<>
    <label>
      Text input: <input name="myInput" className="mr-30" onChange={(e) => setText(e.target.value)} /> {/**/}
    </label>
    <button onClick={() => handleSend()}>
      Send
    </button>
    <hr />
  </>)
}

function Display() {
  const [data, setData] = useState<any[] | null>(null)

  useEffect(() => {
    const getData = async () => {
      const { data: user } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('demo_access')
          .select()
          .order('created_at', { ascending: false })
        setData(data)
      }
    }
    getData()
  }, [])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString(); // Adjust the format according to your preference
  }

  if (!data) return <>waiting</>

  return (
    <table>
      <thead>
        <tr>
          <th>Created At</th>
          <th>Text</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id}>
            <td>{formatTimestamp(item.created_at)}</td>
            <td>{item.text}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}





export default function Page() {
  return (
    <>
      <Test />
      <Display />
    </>
  )
}

