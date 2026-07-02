using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PrisonSystem.Data;
using PrisonSystem.Models;
using System.Collections.Generic;

namespace PrisonSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CellsController : ControllerBase
    {
        Db db = new Db();

        // GET ALL
        [HttpGet]
        public IActionResult Get()
        {
            var list = new List<Cell>();

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Cells", con);
            var r = cmd.ExecuteReader();

            while (r.Read())
            {
                list.Add(new Cell
                {
                    CellId = (int)r["CellId"],
                    CellNumber = r["CellNumber"].ToString(),
                    Capacity = (int)r["Capacity"],
                    Status = r["Status"].ToString()
                });
            }

            return Ok(list);
        }

        // GET BY ID
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("SELECT * FROM Cells WHERE CellId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            var r = cmd.ExecuteReader();

            if (!r.Read())
                return NotFound("Cell not found");

            return Ok(new Cell
            {
                CellId = (int)r["CellId"],
                CellNumber = r["CellNumber"].ToString(),
                Capacity = (int)r["Capacity"],
                Status = r["Status"].ToString()
            });
        }

        // ADD
        [HttpPost]
        public IActionResult Add(Cell c)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("INSERT INTO Cells VALUES(@n,@c,@s)", con);
            cmd.Parameters.AddWithValue("@n", c.CellNumber);
            cmd.Parameters.AddWithValue("@c", c.Capacity);
            cmd.Parameters.AddWithValue("@s", c.Status);

            cmd.ExecuteNonQuery();
            return Ok("Cell added");
        }

        // UPDATE
        [HttpPut]
        public IActionResult Update(Cell c)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("UPDATE Cells SET CellNumber=@n,Capacity=@c,Status=@s WHERE CellId=@id", con);
            cmd.Parameters.AddWithValue("@id", c.CellId);
            cmd.Parameters.AddWithValue("@n", c.CellNumber);
            cmd.Parameters.AddWithValue("@c", c.Capacity);
            cmd.Parameters.AddWithValue("@s", c.Status);

            cmd.ExecuteNonQuery();
            return Ok("Cell updated");
        }

        // DELETE
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            using var con = db.Connection;
            con.Open();

            var cmd = new SqlCommand("DELETE FROM Cells WHERE CellId=@id", con);
            cmd.Parameters.AddWithValue("@id", id);

            cmd.ExecuteNonQuery();
            return Ok("Cell deleted");
        }
    }
}