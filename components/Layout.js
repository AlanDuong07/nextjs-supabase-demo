import React from 'react'

// The layout defines what should exist on every page in our app. 
// You can make nested layouts too, but we'll keep it simple for now.
// Head to pages/_app.js and you'll see the entirety of the app is wrapped in this layout.
export default function Layout({ children }) {
  return (
    <main className="">
        {children}
    </main>
  )
}
