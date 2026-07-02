using System.ComponentModel.DataAnnotations;

namespace PrisonSystem.Models
{
    public class Cell
    {
        public int CellId { get; set; }

        [Required]
        [StringLength(20)]
        public string CellNumber { get; set; } = string.Empty;

        [Range(1, int.MaxValue)]
        public int Capacity { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Available";
    }
}