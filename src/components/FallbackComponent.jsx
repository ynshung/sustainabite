export function fallbackComponent({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <br />
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <br />
      <button className="btn btn-warning" onClick={resetErrorBoundary}>
        Reload
      </button>
      <br />
      <br />
    </div>
  );
}
