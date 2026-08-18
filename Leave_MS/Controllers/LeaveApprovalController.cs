using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
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
        public async Task<IActionResult> GetAllLeaveApprovals()
        {
            var leaveApprovals = await _context.LeaveApprovals
                .Select(la => new LeaveApprovalDTO
                {
                    ApprovalId = la.ApprovalId,
                    Action = la.Action,
                    Comments = la.Comments,
                    ActionDate = la.ActionDate,
                    LeaveRequestId = la.LeaveRequestId,
                    ApprovedBy = la.ApprovedBy,
                    ApprovedByUserName = la.ApprovedByUser.FullName
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<LeaveApprovalDTO>>
            {
                Success = true,
                Message = "Leave approvals retrieved successfully",
                Data = leaveApprovals
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetLeaveApproval(int id)
        {
            var leaveApproval = await _context.LeaveApprovals
                .Where(la => la.ApprovalId == id)
                .Select(la => new LeaveApprovalDTO
                {
                    ApprovalId = la.ApprovalId,
                    Action = la.Action,
                    Comments = la.Comments,
                    ActionDate = la.ActionDate,
                    LeaveRequestId = la.LeaveRequestId,
                    ApprovedBy = la.ApprovedBy,
                    ApprovedByUserName = la.ApprovedByUser.FullName
                })
                .FirstOrDefaultAsync();

            if (leaveApproval == null)
            {
                return NotFound(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Leave Approval not found!!!",
                    Data = null
                });
            }

            return Ok(new ApiResponse<LeaveApprovalDTO>
            {
                Success = true,
                Message = "Leave approval retrieved successfully",
                Data = leaveApproval
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateLeaveApproval(LeaveApprovalDTO la)
        {
            if (la == null)
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Leave Approval data is required!!!",
                    Data = null
                });
            }

            if (!await _context.LeaveRequests
                .AnyAsync(lr => lr.LeaveRequestId == la.LeaveRequestId))
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Invalid Leave Request.",
                    Data = null
                });
            }

            if (!await _context.Users
                .AnyAsync(u => u.UserId == la.ApprovedBy))
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Invalid User.",
                    Data = null
                });
            }

            var newLeaveApproval = new LeaveApproval
            {
                LeaveRequestId = la.LeaveRequestId,
                ApprovedBy = la.ApprovedBy,
                Action = la.Action,
                Comments = la.Comments,
                ActionDate = la.ActionDate
            };

            _context.LeaveApprovals.Add(newLeaveApproval);
            await _context.SaveChangesAsync();

            var result = await _context.LeaveApprovals
                .Where(x => x.ApprovalId == newLeaveApproval.ApprovalId)
                .Select(x => new LeaveApprovalDTO
                {
                    ApprovalId = x.ApprovalId,
                    Action = x.Action,
                    Comments = x.Comments,
                    ActionDate = x.ActionDate,
                    LeaveRequestId = x.LeaveRequestId,
                    ApprovedBy = x.ApprovedBy,
                    ApprovedByUserName = x.ApprovedByUser.FullName
                })
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<LeaveApprovalDTO>
            {
                Success = true,
                Message = "Leave approval created successfully",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLeaveApproval(
            int id,
            LeaveApprovalDTO la)
        {
            if (la == null)
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Leave Approval data is required!!!",
                    Data = null
                });
            }

            if (id != la.ApprovalId)
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "ID Mismatch!!!",
                    Data = null
                });
            }

            var oldLeaveApproval = await _context.LeaveApprovals
                .FindAsync(id);

            if (oldLeaveApproval == null)
            {
                return NotFound(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Leave Approval not found!!!",
                    Data = null
                });
            }

            if (!await _context.LeaveRequests
                .AnyAsync(lr => lr.LeaveRequestId == la.LeaveRequestId))
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Invalid Leave Request.",
                    Data = null
                });
            }

            if (!await _context.Users
                .AnyAsync(u => u.UserId == la.ApprovedBy))
            {
                return BadRequest(new ApiResponse<LeaveApprovalDTO>
                {
                    Success = false,
                    Message = "Invalid User.",
                    Data = null
                });
            }

            oldLeaveApproval.LeaveRequestId = la.LeaveRequestId;
            oldLeaveApproval.ApprovedBy = la.ApprovedBy;
            oldLeaveApproval.Action = la.Action;
            oldLeaveApproval.Comments = la.Comments;
            oldLeaveApproval.ActionDate = la.ActionDate;

            await _context.SaveChangesAsync();

            var updatedLeaveApproval = await _context.LeaveApprovals
                .Where(x => x.ApprovalId == id)
                .Select(x => new LeaveApprovalDTO
                {
                    ApprovalId = x.ApprovalId,
                    Action = x.Action,
                    Comments = x.Comments,
                    ActionDate = x.ActionDate,
                    LeaveRequestId = x.LeaveRequestId,
                    ApprovedBy = x.ApprovedBy,
                    ApprovedByUserName = x.ApprovedByUser.FullName
                })
                .FirstOrDefaultAsync();

            return Ok(new ApiResponse<LeaveApprovalDTO>
            {
                Success = true,
                Message = "Leave approval updated successfully",
                Data = updatedLeaveApproval
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveApproval(int id)
        {
            var la = await _context.LeaveApprovals
                .FindAsync(id);

            if (la == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Leave Approval not found!!!",
                    Data = null
                });
            }

            _context.LeaveApprovals.Remove(la);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Leave Approval Deleted Successfully!!!",
                Data = null
            });
        }
    }
}