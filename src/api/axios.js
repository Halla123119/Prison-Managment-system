import axios from "axios";

// Matches the ASP.NET Core backend's "https" launch profile
// (Properties/launchSettings.json). Run the backend with:
//   dotnet run --launch-profile https
// and trust the dev cert once with:
//   dotnet dev-certs https --trust
//
// If you'd rather run plain HTTP, comment out app.UseHttpsRedirection()
// in the backend's Program.cs and change this to:
//   http://localhost:5232/api
const api = axios.create({
  baseURL: "https://localhost:7229/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the logged-in user's id to every request so the backend can
// scope Prisoners/Cells/Staff data to the user that owns it.
api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem("pms_user");
    const user = stored ? JSON.parse(stored) : null;
    if (user?.userId) {
      config.headers["X-User-Id"] = user.userId;
    }
  } catch {
    // Ignore malformed storage; request goes out without the header.
  }
  return config;
});

export default api;
