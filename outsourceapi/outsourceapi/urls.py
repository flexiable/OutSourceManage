"""outsourceapi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""


from django.conf.urls import url
from django.views.generic import TemplateView
from django.views.static import serve

from outsourceapp import views
from django.contrib import admin
from django.urls import path

from outsourceapp.views import fieldPersonnel,LeaveCheck,OffSiteCheck

from outsourceapi import settings

urlpatterns = [
    path('Login', views.Login, name='Login'),
    path('fieldPersonnelAdd', views.fieldPersonnelAdd, name='fieldPersonnelAdd'),
    path('fieldPersonnelList', views.fieldPersonnel, name='fieldPersonnel'),
    path('LeaveCheckAdd', views.leaveCheckAdd, name='leaveCheckAdd'),
    path('LeaveCheckList', views.leaveCheck, name='leaveCheck'),
     path('OffSiteCheckAdd', views.offSiteAdd, name='offSiteAdd'),
    path('OffSiteCheckList', views.offSite, name='offSite'),
    path('',  views.Index),
    url(r'^admin/', admin.site.urls),

    path('FieldPersonnel/', views.UsersView.as_view()),
    # path(r'^FieldPersonnel/$', views.UsersView.as_view()),
    path('FieldPersonnel/<int:pk>/', views.UsersView.as_view()),
    path('LeaveCheck/', views.LeaveCheckView.as_view()),
       path('LeaveCheck/<int:pk>/', views.LeaveCheckView.as_view()),
        path('OffSiteCheck/', views.OffSiteCheckView.as_view()),
       path('OffSiteCheck/<int:pk>/', views.OffSiteCheckView.as_view()),
    url(r'^files/(?P<path>.*)$', serve, {"document_root": settings.MEDIA_ROOT})
]
