using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PrisonSystem.Data;
using PrisonSystem.Models;
using System.Collections.Generic;

namespace PrisonSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StaffController : ControllerBase
    {
        Db db = new Db();
        /// Get all
        [HttpGet]
        public IActionResult Get()
        {
            var list = new List<Staff>();

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Staff", con);
            var r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new Staff
                {
                    StaffId = (int)r["StaffId"],
                    FullName = r["FullName"].ToString(),
                    Position = r["Position"].ToString(),
                    Phone = r["Phone"].ToString()
                });
            }

            return Ok(list);
        }
        /// Get by id
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Staff WHERE StaffId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            var r = cmd.ExecuteReader();

            if (!r.Read())
                return NotFound("Staff not found");

            return Ok(new Staff
            {
                StaffId = (int)r["StaffId"],
                FullName = r["FullName"].ToString(),
                Position = r["Position"].ToString(),
                Phone = r["Phone"].ToString()
            });
        }
        /// Add new
        [HttpPost]
        public IActionResult Add(Staff s)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("INSERT INTO Staff VALUES(@n,@p,@ph)", con);
            cmd.Parameters.AddWithValue("@n", s.FullName);
            cmd.Parameters.AddWithValue("@p", s.Position);
            cmd.Parameters.AddWithValue("@ph", s.Phone);

            cmd.ExecuteNonQuery();
            return Ok("Staff added");
        }
        /// Update 
        [HttpPut]
        public IActionResult Update(Staff s)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("UPDATE Staff SET FullName=@n,Position=@p,Phone=@ph WHERE StaffId=@id", con);
            cmd.Parameters.AddWithValue("@id", s.StaffId);
            cmd.Parameters.AddWithValue("@n", s.FullName);
            cmd.Parameters.AddWithValue("@p", s.Position);
            cmd.Parameters.AddWithValue("@ph", s.Phone);

            cmd.ExecuteNonQuery();
            return Ok("Staff updated");
        }
                /// Delete
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("DELETE FROM Staff WHERE StaffId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
            return Ok("Staff deleted");
        }
    }
}