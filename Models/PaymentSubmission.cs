namespace PetalFairyApi.Models;

public class PaymentSubmission
{
    public string CustomerName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public decimal Amount { get; set; }

    public string PaymentMethod { get; set; } = string.Empty;

    public string? ReferenceNumber { get; set; }
}