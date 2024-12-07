<?php

namespace App\Enums;

enum DocumentType: string
{
    case RoadTax = 'Road Tax';
    case DrivingLicenseFront = 'Driving License Front';
    case DrivingLicenseBack = 'Driving License Back';
    case InsuranceCoverNote = 'Insurance Cover Note';
}
