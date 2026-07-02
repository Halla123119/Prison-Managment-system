using System.ComponentModel.DataAnnotations;

namespace PrisonSystem.Models
{
    public class Staff
    {
        public int StaffId { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Position { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        [Phone]
        public string Phone { get; set; } = string.Empty;
    }
}