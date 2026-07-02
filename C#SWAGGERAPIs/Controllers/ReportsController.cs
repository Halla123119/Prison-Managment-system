using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using PrisonSystem.Data;

namespace PrisonSystem.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        Db db = new Db();

        [HttpGet]
        public IActionResult GetReport()
        {
            using var con = db.Connection;
            con.Open();

            int prisoners = 0;
            int staff = 0;
            int cells = 0;
            int available = 0;
            int occupied = 0;

            SqlCommand cmd1 = new SqlCommand("SELECT COUNT(*) FROM Prisoners", con);
            prisoners = (int)cmd1.ExecuteScalar();

            SqlCommand cmd2 = new SqlCommand("SELECT COUNT(*) FROM Staff", con);
            staff = (int)cmd2.ExecuteScalar();

            SqlCommand cmd3 = new SqlCommand("SELECT COUNT(*) FROM Cells", con);
            cells = (int)cmd3.ExecuteScalar();

            SqlCommand cmd4 = new SqlCommand("SELECT COUNT(*) FROM Cells WHERE Status='Available'", con);
            available = (int)cmd4.ExecuteScalar();

            SqlCommand cmd5 = new SqlCommand("SELECT COUNT(*) FROM Cells WHERE Status='Occupied'", con);
            occupied = (int)cmd5.ExecuteScalar();

            return Ok(new
            {
                TotalPrisoners = prisoners,
                TotalStaff = staff,
                TotalCells = cells,
                AvailableCells = available,
                OccupiedCells = occupied
            });
        }
    }
}