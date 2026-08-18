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

            return Ok(new ApiResponse<List<LeaveTypeDTO>>
            {
                Success = true,
                Message = "Leave types retrieved successfully",
                Data = leaveTypes
            });
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
                return NotFound(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type not found!!!",
                    Data = null
                });
            }

            return Ok(new ApiResponse<LeaveTypeDTO>
            {
                Success = true,
                Message = "Leave type retrieved successfully",
                Data = leaveType
            });
        }

        [HttpPost]
        public async Task<IActionResult> AddLeaveType(LeaveTypeDTO lt)
        {
            if (lt == null)
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type data is required!!!",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(lt.LeaveTypeName))
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type Name is required!!!",
                    Data = null
                });
            }

            if (await _context.LeaveTypes
                .AnyAsync(n => n.TypeName == lt.LeaveTypeName))
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type Already Exists!!!",
                    Data = null
                });
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

            return Ok(new ApiResponse<LeaveTypeDTO>
            {
                Success = true,
                Message = "Leave type created successfully",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveType(
            int id,
            LeaveTypeDTO lt)
        {
            if (lt == null)
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type data is required!!!",
                    Data = null
                });
            }

            if (id != lt.LeaveTypeId)
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "ID Mismatch!!!",
                    Data = null
                });
            }

            var oldLeaveType = await _context.LeaveTypes.FindAsync(id);

            if (oldLeaveType == null)
            {
                return NotFound(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type not found!!!",
                    Data = null
                });
            }

            if (await _context.LeaveTypes.AnyAsync(n =>
                n.TypeName == lt.LeaveTypeName &&
                n.LeaveTypeId != id))
            {
                return BadRequest(new ApiResponse<LeaveTypeDTO>
                {
                    Success = false,
                    Message = "Leave Type Already Exists!!!",
                    Data = null
                });
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

            return Ok(new ApiResponse<LeaveTypeDTO>
            {
                Success = true,
                Message = "Leave type updated successfully",
                Data = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveType(int id)
        {
            var leaveType = await _context.LeaveTypes.FindAsync(id);

            if (leaveType == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invalid Leave Type ID!!!",
                    Data = null
                });
            }

            _context.LeaveTypes.Remove(leaveType);

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Leave Type Deleted Successfully!!!",
                Data = null
            });
        }
    }
}