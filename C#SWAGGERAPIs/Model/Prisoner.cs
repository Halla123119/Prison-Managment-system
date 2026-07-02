using System.ComponentModel.DataAnnotations;

namespace PrisonSystem.Models
{
    public class Prisoner
    {
        public int PrisonerId { get; set; }

        [Required]
        [StringLength(100)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(10)]
        public string Gender { get; set; } = string.Empty;

        [Range(12, 120)]
        public int Age { get; set; }

        [Required]
        [StringLength(200)]
        public string Crime { get; set; } = string.Empty;

        [Range(0, 100)]
        public int SentenceYears { get; set; }
        public int CellId { get; set; }
    }
}