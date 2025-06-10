import Link from "next/link"
import Header from "@/components/header"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-black flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 max-w-3xl flex-grow">
      <h1 className="text-3xl font-bold mb-8">About datetime.app</h1>
      
      <div className="prose dark:prose-invert">
        <p className="text-lg mb-6">
          datetime.app is a clean and powerful time viewing and conversion tool designed for developers, 
          remote teams, and anyone who needs to work with different time zones.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Clean and intuitive interface</li>
          <li>Precise time display and conversion</li>
          <li>Support for multiple time formats</li>
          <li>Convenient timezone conversion</li>
          <li>Perfect for remote team collaboration</li>
          <li>Developer-friendly features</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">Technology</h2>
        <p className="mb-4">
          datetime.app is developed by the <Link href="https://datetime.app" className="text-blue-600 dark:text-blue-400 hover:underline">datetime.app</Link> team,
          powered by <Link href="https://v0.dev" className="text-blue-600 dark:text-blue-400 hover:underline">v0.dev</Link> and Windsurf technology,
          with design inspiration from <Link href="https://time.is" className="text-blue-600 dark:text-blue-400 hover:underline">time.is</Link>,
          dedicated to providing the best time management experience for our users.
        </p>
      </div>
      </div>
    </main>
  )
}
