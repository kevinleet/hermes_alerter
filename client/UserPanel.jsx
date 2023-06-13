import {
  Container,
  Button,
  Tab,
  Tabs,
  ListGroup,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserPanel = ({ userData, setUserData, isLoggedIn, setIsLoggedIn }) => {
  const [products, setProducts] = useState([]);
  const [dbData, setDbData] = useState({
    subscription_active: "",
    notify_all_restocks: "",
    products_to_alert: [],
  });
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      getDatabaseData();
    }
  }, [isLoggedIn]);
  function logOut() {
    setUserData({
      email: "",
      name: "",
      given_name: "",
      family_name: "",
    });
    setDbData({
      subscription_active: "",
      notify_all_restocks: "",
      products_to_alert: [],
    });
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  }
  async function getDatabaseData() {
    let response = await axios.get(`api/users?email=${userData.email}`);
    const { _id, subscription_active, notify_all_restocks, productsToAlert } =
      response.data[0];
    if (productsToAlert.length == 0) {
      setDbData({
        id: _id,
        subscription_active: subscription_active,
        notify_all_restocks: notify_all_restocks,
        products_to_alert: [],
      });
    } else {
      setDbData({
        id: _id,
        subscription_active: subscription_active,
        notify_all_restocks: notify_all_restocks,
        products_to_alert: productsToAlert,
      });
    }
  }

  async function enableAllRestocks() {
    try {
      await axios.put(`api/users/1`, {
        email: userData.email,
        notify_all_restocks: "true",
      });
      getDatabaseData();
    } catch (error) {
      console.log(error);
    }
  }
  async function disableAllRestocks() {
    try {
      await axios.put(`api/users/1`, {
        email: userData.email,
        notify_all_restocks: "false",
      });
      getDatabaseData();
    } catch (error) {
      console.log(error);
    }
  }

  async function enableProductAlert(id) {
    try {
      await axios.put(`api/users/2`, {
        email: userData.email,
        action: "add",
        product: id,
      });
      await axios.put("api/products", {
        action: "add",
        product: id,
        user: dbData.id,
      });
      getDatabaseData();
    } catch (error) {
      console.log(error);
    }
  }

  async function disableProductAlert(id) {
    try {
      await axios.put(`api/users/2`, {
        email: userData.email,
        action: "remove",
        product: id,
      });
      await axios.put("api/products", {
        action: "remove",
        product: id,
        user: dbData.id,
      });
      getDatabaseData();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Container className="bg-light mt-md-3 py-3 rounded w-100 ">
      <Tabs
        defaultActiveKey="home"
        id="uncontrolled-tab-example"
        className="mb-3"
      >
        <Tab eventKey="home" title="Home">
          <Container style={{ maxWidth: "950px" }} className="text-center">
            <h2>Hello, {userData.given_name}. Nice to meet you.</h2>
            <h6 className="lead mt-4">
              We utilize Stripe for seamless payment processing of our
              subscriptions, providing our consumers with a secure and
              hassle-free experience, thanks to Stripe's robust security
              measures and user-friendly interface.
            </h6>
            <p className="fs-6 mt-3">
              Once your payment is successfully processed, your account status
              will be updated to 'active,' granting you access to customize your
              notification settings. You will then start receiving restock alert
              notifications promptly whenever they occur. This ensures that you
              never miss out on any important updates!
            </p>
          </Container>

          <Container className="d-flex justify-content-center mt-5">
            <stripe-buy-button
              buy-button-id="buy_btn_1NIIfAEnnrWrEekPzBiz7bGy"
              publishable-key="pk_live_51NII8dEnnrWrEekPneZfws2ml3BQSOZpEoJBL6ryNrGOSpWIypfA6OL9QP4YSYFC1SZYcLYlTbCPnGDvc15lM7AA00Fn6b3MDS"
            ></stripe-buy-button>
          </Container>
        </Tab>
        <Tab
          eventKey="Notification Settings"
          title="Notification Settings"
          // disabled
        >
          <Container>
            <Container className="mt-4 text-center">
              <Row className="justify-content-center">
                <Card style={{ width: "24rem" }}>
                  <Card.Body>
                    <Card.Title>
                      Notify All Restocks{" "}
                      {dbData.notify_all_restocks != "true" ? (
                        <span style={{ color: "red" }}>(Disabled)</span>
                      ) : (
                        <span style={{ color: "green" }}>(Enabled)</span>
                      )}
                    </Card.Title>
                    <Card.Text>
                      Enable instant email notifications for all product
                      restocks!
                    </Card.Text>
                    {dbData.notify_all_restocks != "true" ? (
                      <Button variant="success" onClick={enableAllRestocks}>
                        Enable
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        className="btn-sm"
                        onClick={disableAllRestocks}
                      >
                        Disable
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Row>
            </Container>
            <hr />

            <Container>
              <Row className="justify-content-center text-center">
                {products.map((item) => (
                  <Card style={{ width: "16rem" }} className="m-3">
                    <Card.Body>
                      <Card.Title>
                        <span className="fs-6">
                          {item.name}{" "}
                          {dbData.products_to_alert.includes(item._id) ? (
                            <span style={{ color: "green" }}>(Enabled)</span>
                          ) : (
                            <span style={{ color: "red" }}>(Disabled)</span>
                          )}
                        </span>
                      </Card.Title>
                      <Card.Text>
                        <span className="small-text">
                          Enable instant email notifications for all{" "}
                          <strong>{item.name}</strong> restocks!
                        </span>
                      </Card.Text>
                      {dbData.products_to_alert.includes(item._id) ? (
                        <Button
                          variant="secondary"
                          className="btn-sm"
                          onClick={() => disableProductAlert(item._id)}
                        >
                          Disable
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          onClick={() => enableProductAlert(item._id)}
                        >
                          Enable
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </Row>
            </Container>
          </Container>
        </Tab>
        <Tab eventKey="profile" title="Profile">
          <Container>
            <ListGroup>
              <ListGroup.Item>
                <strong>Email: </strong>
                {userData.email}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Name: </strong>
                {userData.name}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Subscription Status: </strong>
                {dbData.subscription_active != "true" ? (
                  <span style={{ color: "red" }}>Not Active</span>
                ) : (
                  <span style={{ color: "green" }}>Active</span>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Notify All Restocks: </strong>
                {dbData.notify_all_restocks != "true" ? (
                  <span style={{ color: "red" }}>False</span>
                ) : (
                  <span style={{ color: "green" }}>True</span>
                )}
              </ListGroup.Item>
              <ListGroup.Item>
                <strong>Products To Alert: </strong>
              </ListGroup.Item>
            </ListGroup>
          </Container>
        </Tab>
      </Tabs>
      <Container className="d-flex justify-content-center mt-4">
        <Button onClick={logOut} className=" btn-sm">
          Log Out
        </Button>
      </Container>
    </Container>
  );
};

export default UserPanel;
