import "./App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import { Theme } from "@radix-ui/themes";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Theme>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Theme>
      </Layout>
    </HashRouter>
  );
}

export default App;
