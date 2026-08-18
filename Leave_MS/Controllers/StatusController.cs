using Leave_MS.Data;
using Leave_MS.Models;
using Leave_MS.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class StatusController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatusController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllStatus()
        {
            var status = await _context.Statuses
                .Select(s => new StatusDTO
                {
                    StatusId = s.StatusId,
                    StatusName = s.StatusName,
                    StatusCssClass = s.StatusCssClass
                })
                .ToListAsync();
            return Ok(new ApiResponse<List<StatusDTO>>
            {
                Success = true,
                Message = "Statuses retrieved successfully",
                Data = status
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetStatus(int id)
        {
            var status = await _context.Statuses
                .Where(s => s.StatusId == id)
                .Select(s => new StatusDTO
                {
                    StatusId = s.StatusId,
                    StatusName = s.StatusName,
                    StatusCssClass = s.StatusCssClass
                })
                .FirstOrDefaultAsync();

            if (status == null)
            {
                return NotFound(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status not found!!!",
                    Data = null
                });
            }

            return Ok(new ApiResponse<StatusDTO>
            {
                Success = true,
                Message = "Status retrieved successfully",
                Data = status
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateStatus(StatusDTO status)
        {
            if (status == null)
            {
                return BadRequest(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status data is required!!!",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(status.StatusName))
            {
                return BadRequest(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status name is required!!!",
                    Data = null
                });
            }

            if (await _context.Statuses.AnyAsync(s => s.StatusName == status.StatusName))
            {
                return BadRequest(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status already exists!!!",
                    Data = null
                });
            }

            var newStatus = new Status()
            {
                StatusName = status.StatusName,
                StatusCssClass = status.StatusCssClass
            };

            _context.Statuses.Add(newStatus);
            await _context.SaveChangesAsync();

            var result = new StatusDTO
            {
                StatusId = newStatus.StatusId,
                StatusName = newStatus.StatusName,
                StatusCssClass = newStatus.StatusCssClass
            };

            return Ok(new ApiResponse<StatusDTO>
            {
                Success = true,
                Message = "Status created successfully",
                Data = result
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStatus(int id, StatusDTO status)
        {
            if (status == null)
            {
                return BadRequest(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status data is required!!!",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(status.StatusName))
            {
                return BadRequest(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Status name is required!!!",
                    Data = null
                });
            }

            var existingStatus = await _context.Statuses.FindAsync(id);

            if (existingStatus == null)
            {
                return NotFound(new ApiResponse<StatusDTO>
                {
                    Success = false,
                    Message = "Invalid ID",
                    Data = null
                });
            }

            existingStatus.StatusName = status.StatusName;
            existingStatus.StatusCssClass = status.StatusCssClass;

            await _context.SaveChangesAsync();

            var result = new StatusDTO
            {
                StatusId = existingStatus.StatusId,
                StatusName = existingStatus.StatusName,
                StatusCssClass = existingStatus.StatusCssClass
            };

            return Ok(new ApiResponse<StatusDTO>
            {
                Success = true,
                Message = "Status updated successfully",
                Data = result
            });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatus(int id)
        {
            var status = await _context.Statuses.FindAsync(id);

            if (status == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Invalid ID",
                    Data = null
                });
            }

            _context.Statuses.Remove(status);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Status Deleted Successfully!!!",
                Data = null
            });
        }
    }
}