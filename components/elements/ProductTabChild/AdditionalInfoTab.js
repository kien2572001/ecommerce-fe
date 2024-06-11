const AdditionalInfoTab = ({ product }) => (
  <table className="font-md">
    <tbody>
      {product?.product_variants?.map((variant, i) => (
        <tr
          key={"product_variant_" + i}
          className={variant.name.toLowerCase().replace(" ", "-")}
        >
          <th>{variant.name}</th>
          <td>
            <p>{variant.value}</p>
          </td>
        </tr>
      ))}
      {/* <tr className="stand-up">
        <th>Stand Up</th>
        <td>
          <p>35″L x 24″W x 37-45″H(front to back wheel)</p>
        </td>
      </tr>
      <tr className="folded-wo-wheels">
        <th>Folded (w/o wheels)</th>
        <td>
          <p>32.5″L x 18.5″W x 16.5″H</p>
        </td>
      </tr>
      <tr className="folded-w-wheels">
        <th>Folded (w/ wheels)</th>
        <td>
          <p>32.5″L x 24″W x 18.5″H</p>
        </td>
      </tr>
      <tr className="door-pass-through">
        <th>Door Pass Through</th>
        <td>
          <p>24</p>
        </td>
      </tr>
      <tr className="frame">
        <th>Frame</th>
        <td>
          <p>Aluminum</p>
        </td>
      </tr>
      <tr className="weight-wo-wheels">
        <th>Weight (w/o wheels)</th>
        <td>
          <p>20 LBS</p>
        </td>
      </tr>
      <tr className="weight-capacity">
        <th>Weight Capacity</th>
        <td>
          <p>60 LBS</p>
        </td>
      </tr>
      <tr className="width">
        <th>Width</th>
        <td>
          <p>24″</p>
        </td>
      </tr>
      <tr className="handle-height-ground-to-handle">
        <th>Handle height (ground to handle)</th>
        <td>
          <p>37-45″</p>
        </td>
      </tr>
      <tr className="wheels">
        <th>Wheels</th>
        <td>
          <p>12″ air / wide track slick tread</p>
        </td>
      </tr>
      <tr className="seat-back-height">
        <th>Seat back height</th>
        <td>
          <p>21.5″</p>
        </td>
      </tr>
      <tr className="head-room-inside-canopy">
        <th>Head room (inside canopy)</th>
        <td>
          <p>25″</p>
        </td>
      </tr>
      <tr className="pa_color">
        <th>Color</th>
        <td>
          <p>Black, Blue, Red, White</p>
        </td>
      </tr>
      <tr className="pa_size">
        <th>Size</th>
        <td>
          <p>M, S</p>
        </td>
      </tr> */}
    </tbody>
  </table>
);

export default AdditionalInfoTab;
