export default function Loader({ label = 'Loading' }) {
  return <span className="loader" role="status"><span className="spinner" />{label}</span>
}
