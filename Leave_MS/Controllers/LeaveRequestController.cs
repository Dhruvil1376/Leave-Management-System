using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
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
        public async Task<IActionResult> GetAllLeaveRequests()
        {
            var leaveRequests = await _context.LeaveRequests
                .Select(lr => new LeaveRequestDTO
                {
                    LeaveRequestId = lr.LeaveRequestId,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    TotalDays = lr.TotalDays,
                    Reason = lr.Reason,

                    UserId = lr.UserId,
                    UserName = lr.User.FullName,

                    LeaveTypeId = lr.LeaveTypeId,
                    LeaveTypeName = lr.LeaveType.TypeName,

                    StatusId = lr.StatusId,
                    StatusName = lr.Status.StatusName
                })
                .ToListAsync();

            return Ok(leaveRequests);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveRequest(int id)
        {
            var leaveRequest = await _context.LeaveRequests
                .Where(lr => lr.LeaveRequestId == id)
                .Select(lr => new LeaveRequestDTO
                {
                    LeaveRequestId = lr.LeaveRequestId,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    TotalDays = lr.TotalDays,
                    Reason = lr.Reason,

                    UserId = lr.UserId,
                    UserName = lr.User.FullName,

                    LeaveTypeId = lr.LeaveTypeId,
                    LeaveTypeName = lr.LeaveType.TypeName,

                    StatusId = lr.StatusId,
                    StatusName = lr.Status.StatusName
                })
                .FirstOrDefaultAsync();

            if (leaveRequest == null)
                return NotFound("Leave Request Not Found!!!");

            return Ok(leaveRequest);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveRequest(LeaveRequestDTO lr)
        {
            if (lr == null)
                return BadRequest("Leave Request data is required!!!");

            if (lr.StartDate > lr.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            // Check User
            if (!await _context.Users.AnyAsync(u => u.UserId == lr.UserId))
                return BadRequest("Invalid UserId!!!");

            // Check Leave Type
            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == lr.LeaveTypeId))
            {
                return BadRequest("Invalid LeaveTypeId!!!");
            }

            // Check Status
            if (!await _context.Statuses
                .AnyAsync(s => s.StatusId == lr.StatusId))
            {
                return BadRequest("Invalid StatusId!!!");
            }

            var newLeaveRequest = new LeaveRequest
            {
                UserId = lr.UserId,
                LeaveTypeId = lr.LeaveTypeId,
                StatusId = lr.StatusId,
                StartDate = lr.StartDate,
                EndDate = lr.EndDate,
                Reason = lr.Reason,
                TotalDays = lr.TotalDays
            };

            _context.LeaveRequests.Add(newLeaveRequest);
            await _context.SaveChangesAsync();

            var result = await _context.LeaveRequests
                .Where(x => x.LeaveRequestId == newLeaveRequest.LeaveRequestId)
                .Select(x => new LeaveRequestDTO
                {
                    LeaveRequestId = x.LeaveRequestId,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    TotalDays = x.TotalDays,
                    Reason = x.Reason,

                    UserId = x.UserId,
                    UserName = x.User.FullName,

                    LeaveTypeId = x.LeaveTypeId,
                    LeaveTypeName = x.LeaveType.TypeName,

                    StatusId = x.StatusId,
                    StatusName = x.Status.StatusName
                })
                .FirstOrDefaultAsync();

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveRequest(
            int id,
            LeaveRequestDTO lr)
        {
            if (lr == null)
                return BadRequest("Leave Request data is required!!!");

            if (id != lr.LeaveRequestId)
                return BadRequest("ID Mismatch!!!");

            if (lr.StartDate > lr.EndDate)
                return BadRequest("Start Date cannot be greater than End Date!!!");

            var oldRequest = await _context.LeaveRequests.FindAsync(id);

            if (oldRequest == null)
                return NotFound("Leave Request not found!!!");

            if (!await _context.Users.AnyAsync(u => u.UserId == lr.UserId))
                return BadRequest("Invalid UserId!!!");

            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == lr.LeaveTypeId))
            {
                return BadRequest("Invalid LeaveTypeId!!!");
            }

            if (!await _context.Statuses
                .AnyAsync(s => s.StatusId == lr.StatusId))
            {
                return BadRequest("Invalid StatusId!!!");
            }

            oldRequest.UserId = lr.UserId;
            oldRequest.LeaveTypeId = lr.LeaveTypeId;
            oldRequest.StatusId = lr.StatusId;
            oldRequest.StartDate = lr.StartDate;
            oldRequest.EndDate = lr.EndDate;
            oldRequest.Reason = lr.Reason;
            oldRequest.TotalDays = lr.TotalDays;

            await _context.SaveChangesAsync();

            var updatedRequest = await _context.LeaveRequests
                .Where(x => x.LeaveRequestId == id)
                .Select(x => new LeaveRequestDTO
                {
                    LeaveRequestId = x.LeaveRequestId,
                    StartDate = x.StartDate,
                    EndDate = x.EndDate,
                    TotalDays = x.TotalDays,
                    Reason = x.Reason,

                    UserId = x.UserId,
                    UserName = x.User.FullName,

                    LeaveTypeId = x.LeaveTypeId,
                    LeaveTypeName = x.LeaveType.TypeName,

                    StatusId = x.StatusId,
                    StatusName = x.Status.StatusName
                })
                .FirstOrDefaultAsync();

            return Ok(updatedRequest);
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