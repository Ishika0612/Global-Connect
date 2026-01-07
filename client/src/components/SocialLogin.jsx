// src/components/SocialLogin.jsx
import { GoogleLogin } from "@react-oauth/google";

const SocialLogin = () => {
  const handleLogin = async (credentialResponse) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Login success:", data);
        // Optionally save token in localStorage or context
      } else {
        console.error("❌ Login failed:", data.message);
      }
    } catch (err) {
      console.error("Server error:", err);
    }
  };

  return (
    <div className="my-4">
      <GoogleLogin onSuccess={handleLogin} onError={() => console.error("Google login failed")} />
    </div>
  );
};

export default SocialLogin;
