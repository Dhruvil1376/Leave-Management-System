namespace Leave_MS.DTOs
{
    public class CalendarYearDTO
    {
        public int CalendarYearId { get; set; }
        public string CalendarYearName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
