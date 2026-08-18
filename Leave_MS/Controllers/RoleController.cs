using Leave_MS.Data;
using Leave_MS.DTOs;
using Leave_MS.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Leave_MS.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class RoleController : ControllerBase
    {
        private readonly AppDbContext _context;

        public RoleController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _context.Roles
                .Select(r => new RoleDTO
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<RoleDTO>>
            {
                Success = true,
                Message = "Roles retrieved successfully",
                Data = roles
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetRole(int id)
        {
            var role = await _context.Roles
                .Where(r => r.RoleId == id)
                .Select(r => new RoleDTO
                {
                    RoleId = r.RoleId,
                    RoleName = r.RoleName,
                    Description = r.Description
                })
                .FirstOrDefaultAsync();

            if (role == null)
            {
                return NotFound(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role not found",
                    Data = null
                });
            }

            return Ok(new ApiResponse<RoleDTO>
            {
                Success = true,
                Message = "Role retrieved successfully",
                Data = role
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRole([FromBody] RoleDTO role)
        {
            if (role == null)
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role data is required",
                    Data = null
                });
            }

            if (string.IsNullOrWhiteSpace(role.RoleName))
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role name is required",
                    Data = null
                });
            }

            bool roleExists = await _context.Roles
                .AnyAsync(r => r.RoleName == role.RoleName);

            if (roleExists)
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role already exists",
                    Data = null
                });
            }

            var newRole = new Role
            {
                RoleName = role.RoleName,
                Description = role.Description
            };

            _context.Roles.Add(newRole);
            await _context.SaveChangesAsync();

            var createdRole = new RoleDTO
            {
                RoleId = newRole.RoleId,
                RoleName = newRole.RoleName,
                Description = newRole.Description
            };

            return Ok(new ApiResponse<RoleDTO>
            {
                Success = true,
                Message = "Role created successfully",
                Data = createdRole
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRole(
            int id,
            [FromBody] RoleDTO role)
        {
            if (role == null)
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role data is required",
                    Data = null
                });
            }

            if (id != role.RoleId)
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "ID mismatch",
                    Data = null
                });
            }

            var oldRole = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleId == id);

            if (oldRole == null)
            {
                return NotFound(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Role not found",
                    Data = null
                });
            }

            bool roleExists = await _context.Roles
                .AnyAsync(r =>
                    r.RoleName == role.RoleName &&
                    r.RoleId != id);

            if (roleExists)
            {
                return BadRequest(new ApiResponse<RoleDTO>
                {
                    Success = false,
                    Message = "Another role with the same name already exists",
                    Data = null
                });
            }

            oldRole.RoleName = role.RoleName;
            oldRole.Description = role.Description;

            await _context.SaveChangesAsync();

            var updatedRole = new RoleDTO
            {
                RoleId = oldRole.RoleId,
                RoleName = oldRole.RoleName,
                Description = oldRole.Description
            };

            return Ok(new ApiResponse<RoleDTO>
            {
                Success = true,
                Message = "Role updated successfully",
                Data = updatedRole
            });
        }

        // DELETE: api/Role/DeleteRole/1
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRole(int id)
        {
            var role = await _context.Roles
                .FirstOrDefaultAsync(r => r.RoleId == id);

            if (role == null)
            {
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Role not found",
                    Data = null
                });
            }

            _context.Roles.Remove(role);
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Role deleted successfully",
                Data = null
            });
        }
    }
}