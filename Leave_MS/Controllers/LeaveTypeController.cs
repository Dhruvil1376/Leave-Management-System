using Leave_MS.Data;
using Leave_MS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Leave_MS.DTOs;

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
        public async Task<IActionResult> GetAllLeaveTypes()
        {
            var leaveTypes = await _context.LeaveTypes
                .Select(lt => new LeaveTypeDTO
                {
                    LeaveTypeId = lt.LeaveTypeId,
                    LeaveTypeName = lt.TypeName,
                    CssClass = lt.CssClass
                })
                .ToListAsync();

            return Ok(leaveTypes);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveType(int id)
        {
            var leaveType = await _context.LeaveTypes
                .Where(lt => lt.LeaveTypeId == id)
                .Select(lt => new LeaveTypeDTO
                {
                    LeaveTypeId = lt.LeaveTypeId,
                    LeaveTypeName = lt.TypeName,
                    CssClass = lt.CssClass
                })
                .FirstOrDefaultAsync();

            if (leaveType == null)
            {
                return NotFound("Leave Type not found!!!");
            }

            return Ok(leaveType);
        }

        [HttpPost]
        public async Task<IActionResult> AddLeaveType(LeaveTypeDTO lt)
        {
            if (lt == null)
                return BadRequest("Leave Type data is required!!!");

            if (string.IsNullOrWhiteSpace(lt.LeaveTypeName))
                return BadRequest("Leave Type Name is required!!!");

            if (await _context.LeaveTypes
                .AnyAsync(n => n.TypeName == lt.LeaveTypeName))
            {
                return BadRequest("Leave Type Already Exists!!!");
            }

            var newLeaveType = new LeaveType
            {
                TypeName = lt.LeaveTypeName,
                CssClass = lt.CssClass
            };

            _context.LeaveTypes.Add(newLeaveType);
            await _context.SaveChangesAsync();

            var result = new LeaveTypeDTO
            {
                LeaveTypeId = newLeaveType.LeaveTypeId,
                LeaveTypeName = newLeaveType.TypeName,
                CssClass = newLeaveType.CssClass
            };

            return Ok(result);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveType(
            int id,
            LeaveTypeDTO lt)
        {
            if (lt == null)
                return BadRequest("Leave Type data is required!!!");

            if (id != lt.LeaveTypeId)
                return BadRequest("ID Mismatch!!!");

            var oldLeaveType = await _context.LeaveTypes.FindAsync(id);

            if (oldLeaveType == null)
                return NotFound("Leave Type not found!!!");

            if (await _context.LeaveTypes.AnyAsync(n =>
                n.TypeName == lt.LeaveTypeName &&
                n.LeaveTypeId != id))
            {
                return BadRequest("Leave Type Already Exists!!!");
            }

            oldLeaveType.TypeName = lt.LeaveTypeName;
            oldLeaveType.CssClass = lt.CssClass;

            await _context.SaveChangesAsync();

            var result = new LeaveTypeDTO
            {
                LeaveTypeId = oldLeaveType.LeaveTypeId,
                LeaveTypeName = oldLeaveType.TypeName,
                CssClass = oldLeaveType.CssClass
            };

            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveType(int id)
        {
            var leaveType = await _context.LeaveTypes.FindAsync(id);

            if (leaveType == null)
            {
                return NotFound("Invalid Leave Type ID!!!");
            }

            _context.LeaveTypes.Remove(leaveType);

            await _context.SaveChangesAsync();

            return Ok("Leave Type Deleted Successfully!!!");
        }
    }
}