using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Http;
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
        public async Task<IActionResult> GetLeaveBalances()
        {
            var lb= await _context.LeaveBalances
                .Include(u=>u.User)
                .Include(lt=>lt.LeaveType)
                .Include(cd=>cd.CalendarYear)
                .ToListAsync();
            return Ok(lb);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveBalance(int id)
        {
            var lb= await _context.LeaveBalances
                .Include(u=>u.User)
                .Include(lt=>lt.LeaveType)
                .Include(cd => cd.CalendarYear)
                .FirstOrDefaultAsync(l=>l.LeaveBalanceId==id);

            if(lb==null)
                return NotFound("Leave Balance Not Found!!!");

            return Ok(lb);
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveBalance(LeaveBalance leaveBalance)
        {
            if (await _context.LeaveBalances.AnyAsync(lb =>
            lb.UserId == leaveBalance.UserId &&
            lb.LeaveTypeId == leaveBalance.LeaveTypeId &&
            lb.CalendarYearId == leaveBalance.CalendarYearId))
                {
                    return BadRequest("Leave balance already exists!!!");
                }

            _context.LeaveBalances.Add(leaveBalance);
            await _context.SaveChangesAsync();

            return Ok(leaveBalance);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveBalance(int id,LeaveBalance leaveBalance)
        {
            if (id != leaveBalance.LeaveBalanceId)
                return BadRequest("ID Mismatch!!!");

            var oldLeaveBalance = await _context.LeaveBalances.FindAsync(id);

            if (oldLeaveBalance == null)
                return NotFound("Leave Balance not found!!!");

            oldLeaveBalance.UserId = leaveBalance.UserId;
            oldLeaveBalance.LeaveTypeId = leaveBalance.LeaveTypeId;
            oldLeaveBalance.CalendarYearId = leaveBalance.CalendarYearId;
            oldLeaveBalance.AllocatedDays = leaveBalance.AllocatedDays;
            oldLeaveBalance.UsedDays = leaveBalance.UsedDays;

            await _context.SaveChangesAsync();

            return Ok(oldLeaveBalance);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveBalance(int id)
        {
            var leaveBalance = await _context.LeaveBalances.FindAsync(id);

            if (leaveBalance == null)
                return NotFound("Leave Balance not found!!!");

            _context.LeaveBalances.Remove(leaveBalance);
            await _context.SaveChangesAsync();

            return Ok("Leave Balance Deleted Successfully!!!");
        }
    }
}