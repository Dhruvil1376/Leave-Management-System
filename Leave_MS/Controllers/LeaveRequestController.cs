using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LeaveRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveRequestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaveRequests()
        {
            var lr = await _context.LeaveRequests
                .Include(u=>u.User)
                .Include(lt=>lt.LeaveType)
                .Include(s => s.Status)
                .ToListAsync();
            return Ok(lr);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveRequest(int id)
        {
            var lr = await _context.LeaveRequests
                .Include(u => u.User)
                .Include(lt => lt.LeaveType)
                .Include(s=>s.Status)
                .FirstOrDefaultAsync(lr=>lr.LeaveRequestId==id);

            if (lr == null)
                return NotFound("Leave Request Not Found!!!");

            return Ok(lr);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveRequest(LeaveRequest lr)
        {
            if (lr.StartDate > lr.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            _context.LeaveRequests.Add(lr);
            await _context.SaveChangesAsync();

            return Ok(lr);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveRequest(int id, LeaveRequest lr)
        {
            if (id != lr.LeaveRequestId)
                return BadRequest("ID Mismatch!!!");

            var oldRequest = await _context.LeaveRequests.FindAsync(id);

            if (oldRequest == null)
                return NotFound("Leave Request not found!!!");

            if (lr.StartDate > lr.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            oldRequest.UserId = lr.UserId;
            oldRequest.LeaveTypeId = lr.LeaveTypeId;
            oldRequest.StatusId = lr.StatusId;
            oldRequest.StartDate = lr.StartDate;
            oldRequest.EndDate = lr.EndDate;
            oldRequest.Reason = lr.Reason;
            oldRequest.TotalDays = lr.TotalDays;

            await _context.SaveChangesAsync();

            return Ok(oldRequest);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveRequest(int id)
        {
            var lr = await _context.LeaveRequests.FindAsync(id);

            if (lr == null)
                return NotFound("Leave Request not found!!!");

            _context.LeaveRequests.Remove(lr);
            await _context.SaveChangesAsync();

            return Ok("Leave Request Deleted Successfully!!!");
        }

    }
}
