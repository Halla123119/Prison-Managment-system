using Microsoft.Data.SqlClient;
namespace PrisonSystem.Data
{
    public class Db
    {
        private string _cs = "Server=DESKTOP-8J4IB2T\\SSMS;Database=PrisonManagementSystem;Trusted_Connection=True;TrustServerCertificate=True;";
        public SqlConnection Connection => new SqlConnection(_cs);
    }
}
