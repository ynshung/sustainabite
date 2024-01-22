export function fallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <br />
      <p>Something went wrong:</p>
      <pre className="text-wrap">{error.message}</pre>
      <br />
      <button className="btn btn-warning btn-sm" onClick={resetErrorBoundary}>
        Reload
      </button>
      <br />
      <br />
    </div>
  );
}
