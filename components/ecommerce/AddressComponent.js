import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ShippingServices from "../../services/api/shipping-api";
import { useAuth } from "../../services/hooks/useAuth";
import UserServices from "../../services/api/user-api";
const AddAddressModal = ({ show, onClose, onSave }) => {
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesData = await ShippingServices.getCities();
        setCities(citiesData.data);
      } catch (error) {
        setError("Failed to fetch cities");
      }
    };

    fetchCities();
  }, []);

  const handleSave = () => {
    if (fullName.trim() && phoneNumber.trim() && city && district && ward) {
      ShippingServices.parseAddress(city, district, ward)
        .then((data) => {
          const address = {
            name: fullName,
            phone: phoneNumber,
            city: city,
            district: district,
            ward: ward,
            street: streetAddress,
            full_address: streetAddress + ", " + data.data,
          };
          onSave(address);
          onClose();
        })
        .catch((error) => {
          setError("Failed to save address");
        });
    }
  };

  const handleCityChange = async (e) => {
    setCity(e.target.value);
    setDistrict("");
    setWard("");
    setDistricts([]);
    setWards([]);
  };

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const districtsData = await ShippingServices.getDistricts(city);
        setDistricts(districtsData.data);
      } catch (error) {
        setError("Failed to fetch districts");
      }
    };
    if (city) {
      fetchDistricts();
    }
  }, [city]);

  const handleDistrictChange = async (e) => {
    setDistrict(e.target.value);
    setWard("");
    setWards([]);
  };

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const wardsData = await ShippingServices.getWards(district);
        setWards(wardsData.data);
      } catch (error) {
        setError("Failed to fetch wards");
      }
    };
    if (district) {
      fetchWards();
    }
  }, [district]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Address</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form>
          <Row>
            <Col>
              <Form.Group controlId="formFullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="formPhoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control as="select" value={city} onChange={handleCityChange}>
              <option value="">Select city</option>
              {cities?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDistrict">
            <Form.Label>District</Form.Label>
            <Form.Control
              as="select"
              value={district}
              onChange={handleDistrictChange}
              disabled={!city}
            >
              <option value="">Select district</option>
              {districts?.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formWard">
            <Form.Label>Ward</Form.Label>
            <Form.Control
              as="select"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
              disabled={!district}
            >
              <option value="">Select ward</option>
              {wards?.map((ward) => (
                <option key={ward.id} value={ward.id}>
                  {ward.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formStreetAddress">
            <Form.Label>Street Address</Form.Label>
            <Form.Control
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              placeholder="Enter street address"
            />
          </Form.Group>
          <Form.Group controlId="formMap">
            <Form.Label>Map</Form.Label>
            <div
              style={{
                height: "200px",
                backgroundColor: "#e9ecef",
                border: "1px solid #ced4da",
              }}
            >
              {/* Embed your map here */}
              <p className="text-center mt-5">Map will be displayed here</p>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} size="sm">
          <span>Save Address</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const AddressComponent = ({ setAddress }) => {
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const data = await UserServices.fetchMyProfile();
        //console.log("address", data.address);
        setSelectedAddress(data.address);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) {
      fetchAddress();
    }
  }, [user]);

  const handleAddAddress = () => {
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
  };

  const handleSaveAddress = (address) => {
    setSelectedAddress(address);
    setShowAddModal(false);
  };

  return (
    <div className="col-lg-12">
      <div className="border p-40 cart-totals ml-30 mb-50">
        <div className="d-flex align-items-end justify-content-between mb-30">
          <h5>Delivery Address</h5>
          <Button variant="primary" onClick={handleAddAddress} size="sm">
            Select Address
          </Button>
        </div>

        <div className="divider-2 mb-30"></div>
        <div>
          <AddAddressModal
            show={showAddModal}
            onClose={handleCloseAddModal}
            onSave={handleSaveAddress}
          />

          <div style={{ display: "flex", alignItems: "center" }}>
            {selectedAddress && (
              <p style={{ margin: 0, fontSize: "20px" }}>
                <strong style={{ color: "black" }}>
                  {selectedAddress.name}, {selectedAddress.phone}
                </strong>{" "}
                {"  -  "}
                {selectedAddress.full_address}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressComponent;
