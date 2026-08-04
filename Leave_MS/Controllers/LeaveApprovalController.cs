using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LeaveApprovalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveApprovalController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaveApprovals()
        {
            var leaveApprovals = await _context.LeaveApprovals
                .Include(lr=>lr.LeaveRequest)
                .Include(u=>u.ApprovedByUser)
                .ToListAsync();
            return Ok(leaveApprovals);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveApproval(int id)
        {
            var la = await _context.LeaveApprovals
                .Include(lr => lr.LeaveRequest)
                .Include(u => u.ApprovedByUser)
                .FirstOrDefaultAsync(la=>la.ApprovalId==id);

            if (la == null)
                return NotFound("Leave Approval not found!!!");

            return Ok(la);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveApproval(LeaveApproval la)
        {
            if (!await _context.LeaveRequests.AnyAsync(lr => lr.LeaveRequestId == la.LeaveRequestId))
                return BadRequest("Invalid Leave Request.");

            if (!await _context.Users.AnyAsync(u => u.UserId == la.ApprovedBy))
                return BadRequest("Invalid User.");

            _context.LeaveApprovals.Add(la);
            await _context.SaveChangesAsync();

            return Ok(la);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveApproval(int id, LeaveApproval la)
        {
            if (id != la.ApprovalId)
                return BadRequest("ID Mismatch!!!");

            var oldLeaveApproval = await _context.LeaveApprovals.FindAsync(id);

            if (oldLeaveApproval == null)
                return NotFound("Leave Approval not found!!!");

            oldLeaveApproval.LeaveRequestId = la.LeaveRequestId;
            oldLeaveApproval.ApprovedBy = la.ApprovedBy;
            oldLeaveApproval.Action = la.Action;
            oldLeaveApproval.Comments = la.Comments;
            oldLeaveApproval.ActionDate = la.ActionDate;

            await _context.SaveChangesAsync();

            return Ok(oldLeaveApproval);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveApproval(int id)
        {
            var la = await _context.LeaveApprovals.FindAsync(id);

            if (la == null)
                return NotFound("Leave Approval not found!!!");

            _context.LeaveApprovals.Remove(la);
            await _context.SaveChangesAsync();

            return Ok("Leave Approval Deleted Successfully!!!");
        }
    }
}