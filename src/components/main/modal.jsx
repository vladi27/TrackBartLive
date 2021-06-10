import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Modal";
import logo from "../../../a236b50006a999f8a84d5a9de2c56740.jpg";

function WelcomeModal() {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="my-modal"
        contentClassName="custom-modal-style"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <img
              src={logo}
              className="img-fluid"
              style={{ height: "30px", maxWidth: "100%", textAlign: "center" }}
            />
            <span
              style={{
                marginLeft: "50px",
                textAlign: "center",
                fontFamily: "Hind Arial sans-serif",
                fontWeight: 700,
              }}
            >
              Track Bart Live
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Hey there and thanks for checking out my BART project! This app
            leverages BART API, React and Redux to allow users to track BART
            trains in real-time.
          </p>
          <p>
            To start tracking, please select BART lines from the dropdown menu.
            All trains are animated and their respective positions are
            calculated based on their estimated arrival time to the next
            station. You can also start tracking an individual train/trains by
            clicking on them, and every time these trains depart or arrive at a
            station, the map will auto-pan for you. It's like putting the app
            into an auto-pilot mode :)
          </p>
          <p>
            Please let me know if you have any questions and never miss your
            train!
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default WelcomeModal;
