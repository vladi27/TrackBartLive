import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Modal";
import logo from "./bart_logo.png";

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
        // size="lg"
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
              style={{ height: "40px", maxWidth: "100%", textAlign: "center" }}
            />
            <span
              style={{
                marginLeft: "50px",
                textAlign: "center",
                fontFamily: "Hind Arial sans-serif",
                fontWeight: 300,
              }}
            >
              Welcome to Track Bart Live!
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
            To track a line or multiple lines, use the dropdown menu. All trains
            are animated and their positions are calculated based on their
            estimated arrival time to the next station. You can also click on
            individual trains you want to track and every time these trains
            depart or arrive at a station, the map will autozoom for you. It's
            like magic!
          </p>
          <p>Please let me know if you have any questions and happy BARTing!</p>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default WelcomeModal;
