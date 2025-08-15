/**
 * Chart Type Selector Component
 * 
 * Allows users to select between different chart types
 * Visual indicators show which types support multiple Y-axes
 */
import { chartTypes } from './chartUtils';

export default function ChartTypeSelector({ selectedChart, onChange, disabled }) {
  return (
    <>
      <h5 className="mt-4">Chart Type</h5>
      <div className="d-flex gap-2 flex-wrap">
        {chartTypes.map(({ type, supportsMultiY }) => (
          <div
            key={type}
            onClick={() => !disabled && onChange(type)}
            className={`p-2 border rounded shadow-sm text-center
              ${selectedChart === type ? 'bg-primary text-white' : 'bg-light text-dark'}`}
            style={{
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.6 : 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: 80,
              height: 60,
              justifyContent: 'center',
              fontWeight: '500',
            }}
          >
            {type}
            <small className={selectedChart === type ? 'text-white-50' : 'text-muted'}>
              {supportsMultiY ? 'Multi-Y' : 'Single-Y'}
            </small>
          </div>
        ))}
      </div>
    </>
  );
}