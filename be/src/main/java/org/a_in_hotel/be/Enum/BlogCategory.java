package org.a_in_hotel.be.Enum;

public enum BlogCategory {
    NewsUpdates(1,"News & Updates"),
    OffersPromotions(2,"Offers & Promotions"),
    TravelGuides(3,"Travel Guides"),
    LocalFood(4,"Local Food"),
    BookingTips(5,"Booking Tips"),
    HotelServices(6,"Hotel Services"),
    EventsActivities(7,"Events & Activities"),
    NearbyAttractions(8,"Nearby Attractions"),
    TravelTips(9,"Travel Tips"),
    GuestExperiences(10,"Guest Experiences"),;
    private final int code;
    private final String description;
    BlogCategory(int code,String description) {
      this.code = code;
      this.description = description;
    }
    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }
    public static BlogCategory fromCode(int code) {
        for (BlogCategory c : BlogCategory.values()) {
            if (c.code == code) {
                return c;
            }
        }
        throw new IllegalArgumentException("No enum const BlogCategory found with code " + code);
    }
}
