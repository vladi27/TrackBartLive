import React from "react";
import { Route, Switch } from "react-router";
import MainPageContainer from "./main/main_page_container";

const App = () => (
  <Switch>
    <Route exact path="/" component={MainPageContainer} />
    {/* <AuthRoute exact path="/login" component={LoginFormContainer} />
      <AuthRoute exact path="/signup" component={SignupFormContainer} /> */}
  </Switch>
);

export default App;
