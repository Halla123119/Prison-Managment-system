using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PrisonSystem.Data;
using PrisonSystem.Models;

namespace PrisonSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        Db db = new Db();



        // GET ALL USERS
        [HttpGet]
        public IActionResult Get()
        {
            List<User> users = new List<User>();

            using var con = db.Connection;
            con.Open();

            SqlCommand cmd = new SqlCommand(
                "SELECT UserId, Username, Role FROM Users", con);

            SqlDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                users.Add(new User
                {
                    UserId = Convert.ToInt32(dr["UserId"]),
                    Username = dr["Username"].ToString(),
                    Role = dr["Role"].ToString()
                });
            }

            return Ok(users);
        }

        // GET USER BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            using var con = db.Connection;
            con.Open();

            SqlCommand cmd = new SqlCommand(
                "SELECT UserId, Username, Role FROM Users WHERE UserId=@id", con);

            cmd.Parameters.AddWithValue("@id", id);

            SqlDataReader dr = cmd.ExecuteReader();

            if (!dr.Read())
                return NotFound("User Not Found");

            return Ok(new User
            {
                UserId = Convert.ToInt32(dr["UserId"]),
                Username = dr["Username"].ToString(),
                Role = dr["Role"].ToString()
            });
        }

        // REGISTER
        [HttpPost]
        public IActionResult Register(User u)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            SqlCommand check = new SqlCommand(
                "SELECT COUNT(*) FROM Users WHERE Username=@u", con);

            check.Parameters.AddWithValue("@u", u.Username);

            int exists = (int)check.ExecuteScalar();

            if (exists > 0)
                return BadRequest("Username already exists");

            SqlCommand cmd = new SqlCommand(
                "INSERT INTO Users(Username,Password,Role) VALUES(@u,@p,@r)", con);

            cmd.Parameters.AddWithValue("@u", u.Username);
            cmd.Parameters.AddWithValue("@p", u.Password);
            cmd.Parameters.AddWithValue("@r", u.Role);

            cmd.ExecuteNonQuery();

            return Ok("Registration Successful");
        }

        // LOGIN
        [HttpPost("login")]
        public IActionResult Login(User login)
        {
            using var con = db.Connection;
            con.Open();

            SqlCommand cmd = new SqlCommand(
                "SELECT UserId,Username,Role FROM Users WHERE Username=@u AND Password=@p", con);

            cmd.Parameters.AddWithValue("@u", login.Username);
            cmd.Parameters.AddWithValue("@p", login.Password);

            SqlDataReader dr = cmd.ExecuteReader();

            if (!dr.Read())
                return Unauthorized("Invalid Username or Password");

            return Ok(new
            {
                UserId = dr["UserId"],
                Username = dr["Username"],
                Role = dr["Role"]
            });
        }

        // UPDATE USER
        [HttpPut]
        public IActionResult Update(User u)
        {
            using var con = db.Connection;
            con.Open();

            SqlCommand cmd = new SqlCommand(
                @"UPDATE Users
                  SET Username=@u,
                      Password=@p,
                      Role=@r
                  WHERE UserId=@id", con);

            cmd.Parameters.AddWithValue("@id", u.UserId);
            cmd.Parameters.AddWithValue("@u", u.Username);
            cmd.Parameters.AddWithValue("@p", u.Password);
            cmd.Parameters.AddWithValue("@r", u.Role);

            int rows = cmd.ExecuteNonQuery();

            if (rows == 0)
                return NotFound("User Not Found");

            return Ok("User Updated Successfully");
        }

        // DELETE USER
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var con = db.Connection;
            con.Open();

            SqlCommand cmd = new SqlCommand(
                "DELETE FROM Users WHERE UserId=@id", con);

            cmd.Parameters.AddWithValue("@id", id);

            int rows = cmd.ExecuteNonQuery();

            if (rows == 0)
                return NotFound("User Not Found");

            return Ok("User Deleted Successfully");
        }
    }
}