import React from "react";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router";

const { Header, Content, Footer } = Layout;

const items = [
  {
    key: "1",
    label: "Home",
    href: "/",
  },
  {
    key: "2",
    label: "WebGL",
    href: "/webgl",
  },
  {
    key: "3",
    label: "WebGPU",
    href: "/webgpu",
  },
];

const App: React.FC = () => {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const selectedKey = items.findIndex(item => item.href === location) + 1;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout>
      <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          onClick={(e) => {
            navigate(items[Number(e.key) - 1].href);
          }}
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[String(selectedKey)]}
          items={items}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content>
        <div
          style={{
            minHeight: "calc(100vh - 200px)",
          }}
        >
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
};

export default App;
