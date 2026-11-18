import Home from './home-client'

export default function HomePage() {
  // Serialize the server timestamp so hydration uses the same instant.
  // eslint-disable-next-line react-hooks/purity
  return <Home initialTime={Date.now()} />
}
