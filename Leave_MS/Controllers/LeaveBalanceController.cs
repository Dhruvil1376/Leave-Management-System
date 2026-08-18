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

            return Ok(new ApiResponse<List<LeaveBalanceDTO>>
            {
                Success = true,
                Message = "Leave balances retrieved successfully",
                Data = leaveBalances
            });
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
            {
                return NotFound(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave Balance Not Found!!!",
                    Data = null
                });
            }

            return Ok(new ApiResponse<LeaveBalanceDTO>
            {
                Success = true,
                Message = "Leave balance retrieved successfully",
                Data = leaveBalance
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveBalance(
            LeaveBalanceDTO leaveBalance)
        {
            if (leaveBalance == null)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave Balance data is required!!!",
                    Data = null
                });
            }

            if (leaveBalance.AllocatedDays < 0)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Allocated Days cannot be negative!!!",
                    Data = null
                });
            }

            if (leaveBalance.UsedDays < 0)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Used Days cannot be negative!!!",
                    Data = null
                });
            }

            if (leaveBalance.UsedDays > leaveBalance.AllocatedDays)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Used Days cannot be greater than Allocated Days!!!",
                    Data = null
                });
            }

            if (!await _context.Users
                .AnyAsync(u => u.UserId == leaveBalance.UserId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid UserId!!!",
                    Data = null
                });
            }

            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == leaveBalance.LeaveTypeId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid LeaveTypeId!!!",
                    Data = null
                });
            }

            if (!await _context.CalendarYears
                .AnyAsync(cy => cy.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid CalendarYearId!!!",
                    Data = null
                });
            }

            if (await _context.LeaveBalances.AnyAsync(lb =>
                lb.UserId == leaveBalance.UserId &&
                lb.LeaveTypeId == leaveBalance.LeaveTypeId &&
                lb.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave balance already exists!!!",
                    Data = null
                });
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

            return Ok(new ApiResponse<LeaveBalanceDTO>
            {
                Success = true,
                Message = "Leave balance created successfully",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveBalance(
            int id,
            LeaveBalanceDTO leaveBalance)
        {
            if (leaveBalance == null)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave Balance data is required!!!",
                    Data = null
                });
            }

            if (id != leaveBalance.LeaveBalanceId)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "ID Mismatch!!!",
                    Data = null
                });
            }

            var oldLeaveBalance = await _context.LeaveBalances
                .FindAsync(id);

            if (oldLeaveBalance == null)
            {
                return NotFound(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave Balance not found!!!",
                    Data = null
                });
            }

            if (leaveBalance.AllocatedDays < 0)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Allocated Days cannot be negative!!!",
                    Data = null
                });
            }

            if (leaveBalance.UsedDays < 0)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Used Days cannot be negative!!!",
                    Data = null
                });
            }

            if (leaveBalance.UsedDays > leaveBalance.AllocatedDays)
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Used Days cannot be greater than Allocated Days!!!",
                    Data = null
                });
            }

            if (!await _context.Users
                .AnyAsync(u => u.UserId == leaveBalance.UserId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid UserId!!!",
                    Data = null
                });
            }

            if (!await _context.LeaveTypes
                .AnyAsync(lt => lt.LeaveTypeId == leaveBalance.LeaveTypeId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid LeaveTypeId!!!",
                    Data = null
                });
            }

            if (!await _context.CalendarYears
                .AnyAsync(cy => cy.CalendarYearId == leaveBalance.CalendarYearId))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Invalid CalendarYearId!!!",
                    Data = null
                });
            }

            if (await _context.LeaveBalances.AnyAsync(lb =>
                lb.UserId == leaveBalance.UserId &&
                lb.LeaveTypeId == leaveBalance.LeaveTypeId &&
                lb.CalendarYearId == leaveBalance.CalendarYearId &&
                lb.LeaveBalanceId != id))
            {
                return BadRequest(new ApiResponse<LeaveBalanceDTO>
                {
                    Success = false,
                    Message = "Leave balance already exists!!!",
                    Data = null
                });
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

            return Ok(new ApiResponse<LeaveBalanceDTO>
            {
                Success = true,
                Message = "Leave balance updated successfully",
                Data = updatedLeaveBalance
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveBalance(int id)
        {
            var leaveBalance = await _context.LeaveBalances
                .FindAsync(id);

            if (leaveBalance == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Leave Balance not found!!!",
                    Data = null
                });
            }

            _context.LeaveBalances.Remove(leaveBalance);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Leave Balance Deleted Successfully!!!",
                Data = null
            });
        }
    }
}