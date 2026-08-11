namespace Leave_MS.DTOs
{
    public class LeaveApprovalDTO
    {
        public int ApprovalId { get; set; }
        public string? Action { get; set; }
        public string? Comments { get; set; }
        public DateTime ActionDate { get; set; } = DateTime.Now;
        public int LeaveRequestId { get; set; }
        public int ApprovedBy { get; set; }
        public string? ApprovedByUserName { get; set; }
    }
}