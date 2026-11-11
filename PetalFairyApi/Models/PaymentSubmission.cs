namespace PetalFairyApi.Models;

public class PaymentSubmission
{
    public string CustomerName { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? ReferenceNumber { get; set; }
}