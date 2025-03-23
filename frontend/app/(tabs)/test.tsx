import { useEffect } from "react";
import { signup } from "@/lib/api";

export default function TestScreen() {
  useEffect(() => {
    const run = async () => {
      const res = await signup({
        username: "testuser",
        email: "test@example.com",
        password: "secret",
      });

      console.log("🔥 Hello from test screen");
      console.log(res)
    };

    run();
  }, []);

  return null;
}
