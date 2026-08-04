using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class LeaveTypeController : ControllerBase
    {
       
        private readonly AppDbContext _context;

        public LeaveTypeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetLeaveTypes()
        {
            var leavetype = await _context.LeaveTypes.ToListAsync();
            return Ok(leavetype);
        }

        [HttpGet("{id}")]

        public async Task<IActionResult> GetLeaveType(int id)
        {
            var leaveType = await _context.LeaveTypes.FindAsync(id);

            if (leaveType == null)
            {
                return NotFound();
            }
            return Ok(leaveType);
        }

        [HttpPost]

        public async Task<ActionResult<LeaveType>> AddLeaveType(LeaveType lt)
        {
            if (lt == null)
                return BadRequest();

            if (await _context.LeaveTypes.AnyAsync(n => n.TypeName == lt.TypeName))
                return BadRequest("Leave Type Already Exists!!!");

            _context.LeaveTypes.Add(lt);
            await _context.SaveChangesAsync();
            return Ok(lt);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveType(int id, LeaveType lt)
        {
            if (id != lt.LeaveTypeId)
            {
                return BadRequest("ID Mismatch!!!");
            }

            var oldleaveType = await _context.LeaveTypes.FindAsync(id);

            if (oldleaveType == null)
            {
                return NotFound("Leave Type not found!!!");
            }

            oldleaveType.TypeName = lt.TypeName;
            oldleaveType.CssClass = lt.CssClass;
            await _context.SaveChangesAsync();

            return Ok(oldleaveType);
        }

        [HttpDelete("{id}")]

        public async Task<IActionResult> DeleteLeaveType(int id)
        {
            var lt = await _context.LeaveTypes.FindAsync(id);

            if (lt == null)
            {
                return NotFound();
            }

            _context.LeaveTypes.Remove(lt);

            await _context.SaveChangesAsync();

            return Ok("Leave Type Deleted Successfully!!!");
        }
    }
}