import './Spinner.css';

/**
 * @param {'sm'|'md'|'lg'} size
 * @param {string} text  — optional label below spinner
 */
const Spinner = ({ size = 'md', text = '' }) => (
  <div className="spinner-wrapper" role="status" aria-label={text || 'Loading'}>
    <div className={`spinner spinner-${size}`} />
    {text && <p className="spinner-text">{text}</p>}
  </div>
);

export default Spinner;
