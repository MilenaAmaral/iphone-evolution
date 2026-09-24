import PropTypes from 'prop-types'
import './IphoneImageViewer.css'

function IphoneImageViewer({ device }) {
  return (
    <div className="iphone-image-viewer" role="img" aria-label={`Imagens frontal e traseira do ${device.name}`}>
      <div className="iphone-image-viewer__glow" aria-hidden="true" />
      <div className="iphone-image-viewer__pair">
        <figure>
          <img src={device.front} alt={`Vista frontal do ${device.name}`} loading="lazy" decoding="async" />
          <figcaption>frente</figcaption>
        </figure>
        <figure>
          <img src={device.back} alt={`Vista traseira do ${device.name}`} loading="lazy" decoding="async" />
          <figcaption>traseira</figcaption>
        </figure>
      </div>
    </div>
  )
}

IphoneImageViewer.propTypes = {
  device: PropTypes.shape({
    name: PropTypes.string.isRequired,
    front: PropTypes.string.isRequired,
    back: PropTypes.string.isRequired,
  }).isRequired,
}

export default IphoneImageViewer