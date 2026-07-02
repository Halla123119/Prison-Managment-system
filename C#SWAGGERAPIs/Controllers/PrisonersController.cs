using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PrisonSystem.Data;
using PrisonSystem.Models;
using System.Collections.Generic;

namespace PrisonSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PrisonersController : ControllerBase
    {
        Db db = new Db();

        [HttpGet]
        public IActionResult Get()
        {
            var list = new List<Prisoner>();

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Prisoners", con);
            var r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new Prisoner
                {
                    PrisonerId = (int)r["PrisonerId"],
                    FullName = r["FullName"].ToString(),
                    Gender = r["Gender"].ToString(),
                    Age = (int)r["Age"],
                    Crime = r["Crime"].ToString(),
                    SentenceYears = (int)r["SentenceYears"],
                    CellId = (int)r["CellId"]
                });
            }

            return Ok(list);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Prisoners WHERE PrisonerId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            var r = cmd.ExecuteReader();

            if (!r.Read())
                return NotFound("Prisoner not found");

            return Ok(new Prisoner
            {
                PrisonerId = (int)r["PrisonerId"],
                FullName = r["FullName"].ToString(),
                Gender = r["Gender"].ToString(),
                Age = (int)r["Age"],
                Crime = r["Crime"].ToString(),
                SentenceYears = (int)r["SentenceYears"],
                CellId = (int)r["CellId"]
            });
        }

        [HttpPost]
        public IActionResult Add(Prisoner p)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand(@"
                INSERT INTO Prisoners 
                VALUES (@n,@g,@a,@c,@s,@cell)", con);

            cmd.Parameters.AddWithValue("@n", p.FullName);
            cmd.Parameters.AddWithValue("@g", p.Gender);
            cmd.Parameters.AddWithValue("@a", p.Age);
            cmd.Parameters.AddWithValue("@c", p.Crime);
            cmd.Parameters.AddWithValue("@s", p.SentenceYears);
            cmd.Parameters.AddWithValue("@cell", p.CellId);

            cmd.ExecuteNonQuery();
            return Ok("Prisoner added");
        }
        /// update
        [HttpPut]
        public IActionResult Update(Prisoner p)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand(@"
                UPDATE Prisoners SET 
                FullName=@n,Gender=@g,Age=@a,Crime=@c,SentenceYears=@s,CellId=@cell
                WHERE PrisonerId=@id", con);

            cmd.Parameters.AddWithValue("@id", p.PrisonerId);
            cmd.Parameters.AddWithValue("@n", p.FullName);
            cmd.Parameters.AddWithValue("@g", p.Gender);
            cmd.Parameters.AddWithValue("@a", p.Age);
            cmd.Parameters.AddWithValue("@c", p.Crime);
            cmd.Parameters.AddWithValue("@s", p.SentenceYears);
            cmd.Parameters.AddWithValue("@cell", p.CellId);

            cmd.ExecuteNonQuery();
            return Ok("Prisoner updated");
        }
        /// Delete
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("DELETE FROM Prisoners WHERE PrisonerId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
            return Ok("Prisoner deleted");
        }
    }
}