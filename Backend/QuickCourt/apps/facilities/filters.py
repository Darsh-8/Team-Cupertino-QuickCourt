import django_filters

from .models import Facility, Court


class FacilityFilter(django_filters.FilterSet):
    sport = django_filters.CharFilter(method="filter_sport",
                                      field_name="courts__sport_type")
    min_price = django_filters.NumberFilter(method="filter_min_price")
    max_price = django_filters.NumberFilter(method="filter_max_price")
    status = django_filters.CharFilter(field_name="status")

    class Meta:
        model = Facility
        fields = ["sport", "min_price", "max_price", "status"]

    def filter_sport(self, queryset, name, value):
        return queryset.filter(courts__sport_type__iexact=value).distinct()

    def filter_min_price(self, queryset, name, value):
        return queryset.filter(courts__price_per_hour__gte=value).distinct()

    def filter_max_price(self, queryset, name, value):
        return queryset.filter(courts__price_per_hour__lte=value).distinct()


class CourtFilter(django_filters.FilterSet):
    sport_type = django_filters.CharFilter(field_name="sport_type",
                                           lookup_expr="iexact")
    facility = django_filters.NumberFilter(field_name="facility__id")

    class Meta:
        model = Court
        fields = ["sport_type", "facility"]
