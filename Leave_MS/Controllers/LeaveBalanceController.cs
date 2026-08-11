using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LeaveBalanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LeaveBalanceController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLeaveBalances()
        {
            var leaveBalances = await _context.LeaveBalances
                .Select(lb => new LeaveBalanceDTO
                {
                    LeaveBalanceId = lb.LeaveBalanceId,
                    AllocatedDays = lb.AllocatedDays,
                    UsedDays = lb.UsedDays,

                    UserId = lb.UserId,
                    UserName = lb.User.FullName,

                    LeaveTypeId = lb.LeaveTypeId,
                    LeaveTypeName = lb.LeaveType.TypeName,

                    CalendarYearId = lb.CalendarYearId,
                    CalendarYearName = lb.CalendarYear.CalendarYearName
                })
                .ToListAsync();

            return Ok(leaveBalances);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveBalance(int id)
        {
            var leaveBalance = await _context.LeaveBalances
                .Where(lb => lb.LeaveBalanceId == id)
                .Select(lb => new LeaveBalanceDTO
                {
                    LeaveBalanceId = lb.LeaveBalanceId,
                    AllocatedDays = lb.AllocatedDays,
                    UsedDays = lb.UsedDays,

                    UserId = lb.UserId,
                    UserName = lb.User.FullName,

                    LeaveTypeId = lb.LeaveTypeId,
                    LeaveTypeName = lb.LeaveType.TypeName,

                    CalendarYearId = lb.CalendarYearId,
                    CalendarYearName = lb.CalendarYear.CalendarYearName
                })
                .FirstOrDefaultAsync();

            if (leaveBalance == null)
                return NotFound("Leave Balance Not Found!!!");

            return Ok(leaveBalance);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveBalance(
            LeaveBalanceDTO leaveBalance)
        {
            if (leaveBalance == null)
                return BadRequest("Leave Balance data is required!!!");

            if (leaveBalance.AllocatedDays < 0)
                return BadRequest("Allocated Days cannot be negative!!!");

            if (leaveBalance.UsedDays < 0)
                return BadRequest("Used Days cannot be negative!!!");

            if (leaveBalance.UsedDays > leaveBalance.AllocatedDays)
                return BadRequest(
                    "Used Days cannot be greater than Allocated Days!!!");

            if (!await _context.Users
                .AnyAsync(u => u.UserId == leaveBalance.UserId))
            {
                return BadRequest("Invalid UserId!!!");
            }

            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == leaveBalance.LeaveTypeId))
            {
                return BadRequest("Invalid LeaveTypeId!!!");
            }

            if (!await _context.CalendarYears
                .AnyAsync(cy => cy.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest("Invalid CalendarYearId!!!");
            }

            if (await _context.LeaveBalances.AnyAsync(lb =>
                lb.UserId == leaveBalance.UserId &&
                lb.LeaveTypeId == leaveBalance.LeaveTypeId &&
                lb.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest("Leave balance already exists!!!");
            }

            var newLeaveBalance = new LeaveBalance
            {
                UserId = leaveBalance.UserId,
                LeaveTypeId = leaveBalance.LeaveTypeId,
                CalendarYearId = leaveBalance.CalendarYearId,
                AllocatedDays = leaveBalance.AllocatedDays,
                UsedDays = leaveBalance.UsedDays
            };

            _context.LeaveBalances.Add(newLeaveBalance);
            await _context.SaveChangesAsync();

            var result = await _context.LeaveBalances
                .Where(lb => lb.LeaveBalanceId == newLeaveBalance.LeaveBalanceId)
                .Select(lb => new LeaveBalanceDTO
                {
                    LeaveBalanceId = lb.LeaveBalanceId,
                    AllocatedDays = lb.AllocatedDays,
                    UsedDays = lb.UsedDays,

                    UserId = lb.UserId,
                    UserName = lb.User.FullName,

                    LeaveTypeId = lb.LeaveTypeId,
                    LeaveTypeName = lb.LeaveType.TypeName,

                    CalendarYearId = lb.CalendarYearId,
                    CalendarYearName = lb.CalendarYear.CalendarYearName
                })
                .FirstOrDefaultAsync();

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveBalance(
            int id,
            LeaveBalanceDTO leaveBalance)
        {
            if (leaveBalance == null)
                return BadRequest("Leave Balance data is required!!!");

            if (id != leaveBalance.LeaveBalanceId)
                return BadRequest("ID Mismatch!!!");

            var oldLeaveBalance = await _context.LeaveBalances
                .FindAsync(id);

            if (oldLeaveBalance == null)
                return NotFound("Leave Balance not found!!!");

            if (leaveBalance.AllocatedDays < 0)
                return BadRequest("Allocated Days cannot be negative!!!");

            if (leaveBalance.UsedDays < 0)
                return BadRequest("Used Days cannot be negative!!!");

            if (leaveBalance.UsedDays > leaveBalance.AllocatedDays)
                return BadRequest(
                    "Used Days cannot be greater than Allocated Days!!!");

            if (!await _context.Users
                .AnyAsync(u => u.UserId == leaveBalance.UserId))
            {
                return BadRequest("Invalid UserId!!!");
            }

            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == leaveBalance.LeaveTypeId))
            {
                return BadRequest("Invalid LeaveTypeId!!!");
            }

            if (!await _context.CalendarYears
                .AnyAsync(cy => cy.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest("Invalid CalendarYearId!!!");
            }

            if (await _context.LeaveBalances.AnyAsync(lb =>
                lb.UserId == leaveBalance.UserId &&
                lb.LeaveTypeId == leaveBalance.LeaveTypeId &&
                lb.CalendarYearId == leaveBalance.CalendarYearId &&
                lb.LeaveBalanceId != id))
            {
                return BadRequest("Leave balance already exists!!!");
            }

            oldLeaveBalance.UserId = leaveBalance.UserId;
            oldLeaveBalance.LeaveTypeId = leaveBalance.LeaveTypeId;
            oldLeaveBalance.CalendarYearId = leaveBalance.CalendarYearId;
            oldLeaveBalance.AllocatedDays = leaveBalance.AllocatedDays;
            oldLeaveBalance.UsedDays = leaveBalance.UsedDays;

            await _context.SaveChangesAsync();

            var updatedLeaveBalance = await _context.LeaveBalances
                .Where(lb => lb.LeaveBalanceId == id)
                .Select(lb => new LeaveBalanceDTO
                {
                    LeaveBalanceId = lb.LeaveBalanceId,
                    AllocatedDays = lb.AllocatedDays,
                    UsedDays = lb.UsedDays,

                    UserId = lb.UserId,
                    UserName = lb.User.FullName,

                    LeaveTypeId = lb.LeaveTypeId,
                    LeaveTypeName = lb.LeaveType.TypeName,

                    CalendarYearId = lb.CalendarYearId,
                    CalendarYearName = lb.CalendarYear.CalendarYearName
                })
                .FirstOrDefaultAsync();

            return Ok(updatedLeaveBalance);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveBalance(int id)
        {
            var leaveBalance = await _context.LeaveBalances
                .FindAsync(id);

            if (leaveBalance == null)
                return NotFound("Leave Balance not found!!!");

            _context.LeaveBalances.Remove(leaveBalance);
            await _context.SaveChangesAsync();

            return Ok("Leave Balance Deleted Successfully!!!");
        }
    }
}