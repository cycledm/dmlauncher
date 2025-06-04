import React, { useEffect } from "react";

export default function Home(): React.JSX.Element {
  useEffect(() => {
    // 创建一个测试用的localStorage条目
    localStorage.setItem("testKey", "testValue");
    // 从localStorage中获取并打印该条目pnp
    console.log(localStorage.getItem("testKey"));
    // 清除localStorage中的该条目
    localStorage.removeItem("testKey");
  }, []);

  return <div>Home</div>;
}
