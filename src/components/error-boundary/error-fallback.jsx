export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role='alert'>
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <code>{error.stack}</code>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
